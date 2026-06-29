import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import type { Comment } from "../../types";
import { Avatar, AvatarFallback } from "../ui/Avatar";

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem = ({ comment }: CommentItemProps) => {
  const userNickName = (typeof comment.user === 'object' && comment.user) ? comment.user.nickName : "Usuario";
  const userInitials = userNickName.substring(0, 2).toUpperCase();

  return (
    <article className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="flex gap-3">
        <Link to={`/profile/${comment.userId}`}>
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Link
              to={`/profile/${comment.userId}`}
              className="font-bold text-gray-900 dark:text-white hover:underline truncate"
            >
              {userNickName}
            </Link>
            <span className="text-gray-400 dark:text-gray-600">·</span>
            <span className="text-gray-400 dark:text-gray-500 text-sm whitespace-nowrap">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: es })}
            </span>
          </div>
          <p className="text-gray-900 dark:text-white text-[15px] leading-relaxed">
            {comment.text}
          </p>
        </div>
      </div>
    </article>
  );
};
