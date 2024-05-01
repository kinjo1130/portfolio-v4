import Image from "next/image";
export default function SNS() {
  const ICON_SIZE = 60;
  return (
    <div className="mt-10">
      <h3 className="font-bold text-2xl">SNS</h3>
      <ul className="flex gap-3">
        <li>
          <a
            href="https://twitter.com/kinjyo1130"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/twitter.png"
              alt="twitter"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/kinjo1130"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/github.png"
              alt="github"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://www.instagram.com/kinjyo1130/"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/instagram.png"
              alt="instagram"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://qiita.com/abcshotaro616"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/qiita.png"
              alt="qiita"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://zenn.dev/kinjyo"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/zenn.svg"
              alt="zenn"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://speakerdeck.com/kinjyo"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/speakerdeck.png"
              alt="speakerdeck"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
        <li>
          <a
            href="https://scrapbox.io/kinjo1130/"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/scrapbox.png"
              alt="scrapbox"
              width={ICON_SIZE}
              height={ICON_SIZE}
            />
          </a>
        </li>
      </ul>
    </div>
  );
}
