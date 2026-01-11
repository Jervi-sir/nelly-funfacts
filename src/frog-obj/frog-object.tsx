import React from 'react';

export const FrogObject = () => {
  return (
    <>
      <div className="frog">
        <div className="frog__body">
          <div className="frog__head"></div>
          <div className="frog__eye"></div>
          <div className="frog__leg frog__leg--left"></div>
          <div className="frog__leg frog__leg--right"></div>
          <div className="frog__foot frog__foot--left"></div>
          <div className="frog__foot frog__foot--right"></div>
          <div className="frog__belly"></div>
        </div>
        <div className="frog__floor"></div>
      </div>
    </>
  );
};