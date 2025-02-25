import React, { useEffect, useRef, useState } from 'react';
import Quagga from 'quagga';
import camera from "../../assets/images/camera.svg";
import { barcodeSet } from '../../redux/barcodeSlice';
import { fetchBarcodeProducts } from '../../redux/barcodeSlice';
import { useSelector, useDispatch } from 'react-redux';

function BarcodeScanner() {
  const dispatch = useDispatch();
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef(null);
  const [searchProduct, setSearchProduct] = useState('');
  const agent = useSelector((state) => state.agent);
  const { isUser, customer_id } = useSelector((state) => state.user);
  const barcodeDetectedRef = useRef(false); // Ref to track detection state

  const startScanner = async () => {
    const permission = await navigator.permissions.query({ name: 'camera' });
    if (permission.state === 'denied') {
      alert('Camera access denied. Please allow camera access.');
      return;
    }

    setScanning(true);

    setTimeout(() => {
      if (scannerRef.current) {
        Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: scannerRef.current,
              constraints: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'environment',
              },
            },
            decoder: {
              readers: ['code_128_reader', 'ean_reader'],
            },
          },
          function (err) {
            if (err) {
              console.error('Error initializing Quagga:', err);
              return;
            }
            console.log('Quagga initialized successfully');
            Quagga.start();
          }
        );

        Quagga.onDetected((data) => {
          if (!barcodeDetectedRef.current) {
            barcodeDetectedRef.current = true; // Set flag to true
            console.log('Barcode detected: ', data.codeResult.code);
            dispatch(barcodeSet(data.codeResult.code));
            const newBarcode = data.codeResult.code;
            dispatch(
              fetchBarcodeProducts(
                searchProduct,
                agent.storeCode,
                agent.agentCodeOrPhone,
                customer_id,
                newBarcode
              )
            );
            Quagga.stop();
            setScanning(false);

            // Reset detection flag after a delay to allow future scans
            setTimeout(() => {
              barcodeDetectedRef.current = false;
            }, 2000); // Adjust the delay as needed
          }
        });
      }
    }, 300);
  };

  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  return (
    <>
      <div
        className="searchBox--input-icon"
        title="Camera"
        onClick={startScanner}
        style={{ top: '30px' }}
      >
        <img src={camera} alt="Camera" className="img-fluid" />
      </div>

      {scanning && (
        <div
          ref={scannerRef}
          id="scanner"
          style={{
            width: '730px',
            height: '320px',
            margin: '20px auto',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #ccc',
          }}
        ></div>
      )}
    </>
  );
}

export default BarcodeScanner;
