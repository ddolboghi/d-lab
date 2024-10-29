type EditPencilProps = {
  className?: string;
};

export default function EditPencil({ className }: EditPencilProps) {
  let fill: string | undefined = "#5c5c5c";
  if (className && className.includes("fill")) {
    fill = undefined;
  }
  return (
    <svg
      className={className}
      width="11"
      height="11"
      viewBox="0 0 11 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M9.36273 0C8.94371 0 8.52469 0.159572 8.20482 0.479441L7.52637 1.15789L9.84217 3.47368L10.5206 2.79523C11.1598 2.15607 11.1598 1.11918 10.5206 0.479441C10.2008 0.159572 9.78174 0 9.36273 0ZM6.65794 2.02632L0 8.68421V11H2.3158L8.97374 4.34211L6.65794 2.02632Z"
        fill={fill}
      />
    </svg>
  );
}
