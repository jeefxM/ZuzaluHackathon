import React from "react";

interface AvatarProps {
  address: string;
  size?: number;
}

const Avatar: React.FC<AvatarProps> = ({ address, size = 32 }) => {
  // Create URL for DiceBear Avatar
  // You can change the style to: 'pixel-art', 'identicon', 'shapes', etc.
  const avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${address}&size=${size}`;

  return (
    <div
      className="rounded-full overflow-hidden border border-[#00F2FF] border-opacity-20"
      style={{ width: size, height: size }}
    >
      <img
        src={avatarUrl}
        alt={`Avatar for ${address}`}
        width={size}
        height={size}
      />
    </div>
  );
};

export default Avatar;
