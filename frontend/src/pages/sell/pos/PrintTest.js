import React, { useRef } from 'react';
import SimplePrintComponent from './MinimalInvoiceComponent.js';
import { useReactToPrint } from 'react-to-print';

const PrintTest = () => {
    const componentRef = useRef(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div>
            <button onClick={handlePrint}>Print</button>
            <SimplePrintComponent ref={componentRef} />
        </div>
    );
};

export default PrintTest;
