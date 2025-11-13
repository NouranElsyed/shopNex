import { Pagination, PaginationProps } from "antd";

interface ProductPaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: PaginationProps["onChange"];
}

const ProductPagination: React.FC<ProductPaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
}) => {
  if (total <= pageSize) return null;

  return (
    <div className="flex justify-center w-full mt-10">
      <Pagination
        current={current}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </div>
  );
};

export default ProductPagination;
