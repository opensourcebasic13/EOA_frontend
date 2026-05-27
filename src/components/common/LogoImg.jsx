import { useState } from "react";

function LogoImg({ src, name, size = "md" }) {
  const [err, setErr] = useState(false);

  const sizeClass =
    size === "sm" ? "w-7 h-7 text-xs" :
    size === "lg" ? "w-12 h-12 text-base" :
    "w-9 h-9 text-sm";

  if (err) {
    return (
      <div className={`${sizeClass} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0`}>
        {name[0]}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`${sizeClass} rounded-full object-contain border border-gray-100 shrink-0`}
      onError={() => setErr(true)}
    />
  );
}

export default LogoImg;
