export default function (this: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
}
