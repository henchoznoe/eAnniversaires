type HeadingProps = {
  title: string;
}

const Heading = (props: HeadingProps) => {
  return (
    <div className="container py-3 py-lg-4">
      <h1 className="display-3 mb-0">{props.title}</h1>
    </div>
  );
}

export default Heading;