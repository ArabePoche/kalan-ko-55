
import { commentData } from './commentData';
import { commentActions } from './commentActions';

export const commentService = {
  ...commentData,
  toggleCommentLike: commentActions.toggleCommentLike
};
