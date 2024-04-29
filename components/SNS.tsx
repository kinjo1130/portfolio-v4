import Image from "next/image";
export default function SNS() {
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
              width={40}
              height={40}
            />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/kinjo1130"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image src="/sns/github.png" alt="github" width={40} height={40} />
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
              width={40}
              height={40}
            />
          </a>
        </li>
        <li>
          <a
            href="https://qiita.com/kinjo1130"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image src="/sns/qiita.png" alt="qiita" width={40} height={40} />
          </a>
        </li>
        <li>
          <a
            href="https://zenn.dev/kinjo1130"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image src="/sns/zenn.svg" alt="zenn" width={40} height={40} />
          </a>
        </li>
        <li>
          <a
            href="https://speakerdeck.com/kinjo1130"
            target="_black"
            rel="noopener noreferrer"
          >
            <Image
              src="/sns/speakerdeck.png"
              alt="speakerdeck"
              width={40}
              height={40}
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
              width={40}
              height={40}
            />
          </a>
        </li>
      </ul>
    </div>
  );
}
