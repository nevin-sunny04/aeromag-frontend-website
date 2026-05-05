'use server';

export default async function VideoComponent({ src }: { src: string }) {
  return (
    <div
      className="mt-5"
      style={{ position: 'relative', paddingBottom: '56.25%', height: 0, width: '100%' }}
    >
      <iframe
        src={`${src}?rel=0`}
        title="YouTube video"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: '0',
        }}
      />
    </div>
  );
}
