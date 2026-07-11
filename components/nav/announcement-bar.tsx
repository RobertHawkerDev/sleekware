export default function AnnouncementBar() {
  return (
    <div className="h-14 bg-neutral-100 text-center flex items-center justify-center w-full px-4">
      <p className="text-xs tracking-wide text-neutral-900 font-normal">
        This website is a demo store developed by{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://linkedin.com/in/roberthawker-dev"
          className="underline hover:text-black transition-colors"
        >
          Robert Hawker
        </a>
      </p>
    </div>
  );
}
