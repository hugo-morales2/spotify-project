import React from "react";

interface CardProps {
  className: string;
  cardStyle: string;
  m?: string;
  children: React.ReactNode;
  func?: () => void;
}

const Card = ({ className, cardStyle, m, children, func }: CardProps) => {
  return (
    <>
      <div
        className={
          "flex flex-col pt-3 bg-zinc-700 rounded-lg place-items-center transition-colors duration-200 group flex-grow h-full hover:bg-neutral-500 " +
          className
        }
        onClick={func}
      >
        {cardStyle == "unbounded" ? (
          <>
            <div className="bg-neutral-300 rounded-t-lg basis-1/3 w-full flex-grow ">
              bruh
            </div>
            <div className="bg-neutral-500 rounded-b-lg basis-2/3 w-full flex-grow overflow-hidden transition-colors duration-200 group-hover:bg-neutral-500">
              {children}
            </div>
          </>
        ) : (
          <>
            <div
              className={
                "w-8/12 bg-neutral-300 rounded-sm justify-center aspect-square " +
                ("m-" + m || "m-2")
              }
            ></div>
            <div className="bg-zinc-700 py-2 px-3 rounded-b-lg w-full flex-grow overflow-hidden transition-colors duration-200 group-hover:bg-neutral-500">
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Card;
