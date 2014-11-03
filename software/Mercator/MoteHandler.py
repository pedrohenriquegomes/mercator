import copy
import threading
import struct

import serial
import socket

import Hdlc
import MercatorDefines as d

class MoteHandler(threading.Thread):
    
    _BAUDRATE = 115200
    
    STAT_UARTNUMRXCRCOK      = 'uartNumRxCrcOk'
    STAT_UARTNUMRXCRCWRONG   = 'uartNumRxCrcWrong'
    STAT_UARTNUMTX           = 'uartNumTx'
    
    def __init__(self,serialport,cb=None):
        
        self.serialport      = serialport
        self.cb              = cb
        self.serialLock      = threading.Lock()
        self.dataLock        = threading.RLock()
        self.hdlc            = Hdlc.Hdlc()
        self.busyReceiving   = False
        self.inputBuf        = ''
        self.lastRxByte      = self.hdlc.HDLC_FLAG
        self.goOn            = True
        self._resetStats()
        try:
            if self.iotlab:
                self.serial  = socket.socket(socket.AF_INET,socket.SOCK_STREAM)
                self.serial.connect((serialport, 20000))
            else:
                self.serial  = serial.Serial(self.serialport,self._BAUDRATE)
        except Exception as err:
            msg = 'could not connect to {0}, reason: {1}'.format(serialport,err)
            print msg
            raise SystemError(msg)

        threading.Thread.__init__(self)
        self.name            = 'MoteHandler@{0}'.format(serialport)
        self.daemon          = True
        
        self.start()
    
    #======================== thread ==========================================
    
    def run(self):
        
        while self.goOn:
            
            if self.iotlab:
                rxByte = self.serial.recv(1)
            else:
                rxByte = self.serial.read(1)
            
            with self.dataLock:
                if      (
                            (not self.busyReceiving)             and 
                            self.lastRxByte==self.hdlc.HDLC_FLAG and
                            rxByte!=self.hdlc.HDLC_FLAG
                        ):
                    # start of frame
                    
                    self.busyReceiving       = True
                    self.inputBuf            = self.hdlc.HDLC_FLAG
                    self.inputBuf           += rxByte
                elif    (
                            self.busyReceiving                   and
                            rxByte!=self.hdlc.HDLC_FLAG
                        ):
                    # middle of frame
                    
                    self.inputBuf           += rxByte
                elif    (
                            self.busyReceiving                   and
                            rxByte==self.hdlc.HDLC_FLAG
                        ):
                    # end of frame
                    
                    self.busyReceiving       = False
                    self.inputBuf           += rxByte
                    
                    try:
                        self.inputBuf        = self.hdlc.dehdlcify(self.inputBuf)
                    except Hdlc.HdlcException as err:
                        self.stats[self.STAT_UARTNUMRXCRCWRONG] += 1
                    else:
                        self.stats[self.STAT_UARTNUMRXCRCOK] += 1
                        self._handle_inputBuf([ord(b) for b in self.inputBuf])
                
                self.lastRxByte = rxByte
    
    #======================== public ==========================================
    
    #=== stats
    
    def getStats(self):
        with self.dataLock:
            return copy.deepcopy(self.stats)
    
    #=== requests
    
    def send_REQ_ST(self):
        self._send(
            struct.pack(
                '>B',
                d.TYPE_REQ_ST,
            )
        )
    
    def send_REQ_IDLE(self):
        self._send(
            struct.pack(
                '>B',
                d.TYPE_REQ_IDLE,
            )
        )
    
    def send_REQ_TX(self,frequency,txpower,transctr,txnumpk,txifdur,txlength,txfillbyte):
        self._send(
            struct.pack(
                '>BBbBHHBB',
                d.TYPE_REQ_TX,
                frequency,
                txpower,
                transctr,
                txnumpk,
                txifdur,
                txlength,
                txfillbyte,
            )
        )
    
    def send_REQ_RX(self,frequency,srcmac,transctr,txlength,txfillbyte):
        [m0,m1,m2,m3,m4,m5,m6,m7] = srcmac
        self._send(
            struct.pack(
                '>BBBBBBBBBBBBB',
                d.TYPE_REQ_RX,
                frequency,
                m0,m1,m2,m3,m4,m5,m6,m7,
                transctr,
                txlength,
                txfillbyte,
            )
        )
    
    #======================== private =========================================
    
    #=== stats
    
    def _resetStats(self):
        with self.dataLock:
            self.stats = {
                self.STAT_UARTNUMRXCRCOK       : 0,
                self.STAT_UARTNUMRXCRCWRONG    : 0,
                self.STAT_UARTNUMTX            : 0,
            }
    
    #=== serial rx
    
    def _handle_inputBuf(self,inputBuf):
        
        try:
            
            inputtype = inputBuf[0]
            
            if   inputtype == d.TYPE_IND_TXDONE:
                
                [type] = \
                struct.unpack(">B", ''.join([chr(b) for b in inputBuf]))
                
                self.cb(
                    serialport = self.serialport,
                    notif      = {
                        'type':             type,
                    }
                )
                
            elif inputtype == d.TYPE_IND_RX:
                
                [type, length, rssi, flags, pkctr] = \
                struct.unpack(">BBbBH", ''.join([chr(b) for b in inputBuf]))
                if flags & (1<<7):
                    crc          = 1
                else:
                    crc          = 0
                if flags & (1<<6) != 0:
                    expected     = 1
                else:
                    expected     = 0
                
                self.cb(
                    serialport = self.serialport,
                    notif      = {
                        'type':             type,
                        'length':           length,
                        'rssi':             rssi,
                        'crc':              crc,
                        'expected':         expected,
                        'pkctr':            pkctr,
                    }
                )
            
            elif inputtype == d.TYPE_RESP_ST:
                
                [type, status, numnotifications, m1, m2, m3, m4, m5, m6, m7, m8] = \
                struct.unpack(">BBHBBBBBBBB", ''.join([chr(b) for b in inputBuf]))
                
                self.cb(
                    serialport = self.serialport,
                    notif      = {
                        'type':             type,
                        'status':           status,
                        'numnotifications': numnotifications,
                        'mac':              (m1,m2,m3,m4,m5,m6,m7,m8),
                    }
                )
            
            else:
                
                raise SystemError('unknown notification type {0}'.format(inputBuf[0]))
        
        except Exception as err:
            
            print err
            
            self.cb(
                serialport = self.serialport,
                notif      = err,
            )
    
    #=== serial tx
    
    def _send(self,dataToSend):
        with self.dataLock:
            self.stats[self.STAT_UARTNUMTX] += 1
        with self.serialLock:
            if self.iotlab:
                self.serial.send(self.hdlc.hdlcify(dataToSend))
            else:
                self.serial.write(self.hdlc.hdlcify(dataToSend))
    
    #=== helpers
    
    @property
    def iotlab(self):
        if hasattr(self, '_iotlab'):
            return self._iotlab
        
        assert self.serialport
        if   self.serialport.lower().startswith('com') or self.serialport.count('tty'):
            self._iotlab = False
        else:
            self._iotlab = True
        
        return self._iotlab
