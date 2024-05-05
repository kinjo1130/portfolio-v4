type Toc = {
  text: string;
  id: string;
};

export const TableOfContents = ({
  toc,
  className,
}: {
  toc: Toc[];
  className: string;
}) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute("href")?.slice(1);
    if (targetId) {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  };
  return (
    <div className={`${className}`}>
      <p className="TableOfContentsHead">目次</p>
      <ul className="list-disc ml-5">
        {toc.map((data) => (
          <li key={data.id}>
            <a href={`#${data.id}`} onClick={handleClick} className="underline">
              {data.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
