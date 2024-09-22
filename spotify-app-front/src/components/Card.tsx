import React from "react";

interface CardProps {
  className: string;
  cardStyle: string;
  m?: string;
  children: React.ReactNode;
}

const Card = ({ className, cardStyle, m, children }: CardProps) => {
  return (
    <>
      <div className={"flex flex-col bg-zinc-300 rounded-lg " + className}>
        {cardStyle == "unbounded" ? (
          <>
            <div className="bg-neutral-500 rounded-t-lg basis-1/3 flex-grow"></div>
            <div className="bg-blue-400 rounded-b-lg basis-2/3">{children}</div>
          </>
        ) : (
          <>
            <div
              className={
                "bg-neutral-500 rounded-lg basis-5/12 flex-grow " +
                ("m-" + m || "m-2")
              }
            ></div>
            <div className="bg-blue-400 rounded-b-lg basis-7/12">
              {children}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Card;
