import React from "react";

const LayoutHeading = ({ rightComponent = null, title, description }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {rightComponent}
    </div>
  );
};

export default LayoutHeading;
