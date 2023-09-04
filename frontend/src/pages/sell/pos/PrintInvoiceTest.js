import React from 'react';
import MinimalInvoiceComponent from './MinimalInvoiceComponent';
import { useReactToPrint } from 'react-to-print';

const PrintInvoiceTest = () => {
    const data = {
        // Initialize data object with necessary values
        invoiceTableData: [
            { productname: 'Product 1', hsn: '123' },
            { productname: 'Product 2', hsn: '456' },
            // Add more sample data
        ],
    };

    const PrintWrapper = ({ children }) => {
        const componentRefs = [React.createRef(), React.createRef(), React.createRef()];

        const handlePrint = useReactToPrint({
            content: () => componentRefs.map((ref) => ref.current),
        });

        return (
            <div>
                <button onClick={handlePrint}>Print Invoice</button>
                {React.Children.map(children, (child, index) =>
                    React.cloneElement(child, { ref: componentRefs[index], data })
                )}
            </div>
        );
    };

    return (
        <PrintWrapper>
            <MinimalInvoiceComponent heading="Original" />
            <MinimalInvoiceComponent heading="Duplicate" />
            <MinimalInvoiceComponent heading="Customer" />
        </PrintWrapper>
    );
};

export default PrintInvoiceTest;
