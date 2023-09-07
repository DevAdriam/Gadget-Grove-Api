type responseInterface<T> = {
  statusCode: number;
  Message: string;
  devMessage: string;
  body: T;
};

const Responser = ({
  statusCode,
  Message,
  devMessage,
  body,
}: responseInterface<typeof body>) => {
  return {
    meta: {
      statusCode: statusCode >= 200 && statusCode <= 300 ? true : false,
      Message,
      devMessage,
    },
    body,
  };
};
