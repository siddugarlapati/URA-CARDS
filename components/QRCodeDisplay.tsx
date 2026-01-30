import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User } from '../types';

interface QRCodeDisplayProps {
    user: User;
    size?: number;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ user, size = 256 }) => {
    // Create QR data with user information
    const qrData = JSON.stringify({
        type: 'ura-card-friend',
        uniqueId: user.uniqueId,
        name: user.name,
        userId: user.id
    });

    return (
        <div className="flex flex-col items-center">
            <QRCodeSVG
                value={qrData}
                size={size}
                level="H"
                includeMargin={false}
                className="rounded-2xl"
            />
        </div>
    );
};

export default QRCodeDisplay;
