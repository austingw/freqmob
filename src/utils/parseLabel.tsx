export const parseLabel = (sort: SortOptions) => {
  switch (sort) {
    case "new":
      return "Latest";
    case "likes":
      return "Top";
    case "comments":
      return "Comments";
    default:
      return "Latest";
  }
};
