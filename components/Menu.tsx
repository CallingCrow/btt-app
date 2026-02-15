import React from "react";

const Menu = ({ showAll }: any) => {
  return (
    <div>
      <div>Nav</div>
      <div>
        {showAll ? (
          <div>All secitons</div>
        ) : (
          <div>Only show selected section</div>
        )}
      </div>
    </div>
  );
};

export default Menu;
