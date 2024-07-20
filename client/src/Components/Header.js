import React, { useEffect, useState } from "react";

export default function Header() {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => setFontLoaded(true));
  }, []);

  return (
    <h1 className="header" style={{ visibility: fontLoaded ? 'visible' : 'hidden' }}>
      2048
    </h1>
  );
}
