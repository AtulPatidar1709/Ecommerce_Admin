import Link from "next/link";

const page = () => {
  return (
    <div>
      <Link
        className="bg-gray-200 font-semibold rounded-lg py-2 px-3"
        href={"/products/new"}
      >
        Add new Product
      </Link>
    </div>
  );
};

export default page;
