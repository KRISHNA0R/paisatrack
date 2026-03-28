import { motion } from 'framer-motion';

const Skeleton = ({ className, ...props }) => (
  <motion.div
    initial={{ opacity: 0.6 }}
    animate={{ opacity: [0.6, 1, 0.6] }}
    transition={{ duration: 1.5, repeat: Infinity }}
    className={`bg-[var(--border-color)] rounded-lg ${className}`}
    {...props}
  />
);

export const CardSkeleton = () => (
  <div className="glass rounded-xl p-4">
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
    <Skeleton className="h-2 w-full rounded-full" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass rounded-xl p-4 h-[350px]">
    <div className="flex gap-2 mb-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-10 w-20 rounded-lg" />
      ))}
    </div>
    <div className="flex items-end justify-around h-[250px] gap-4">
      {[20, 40, 30, 50, 35, 45, 25, 55, 40, 30, 45, 35].map((h, i) => (
        <Skeleton key={i} style={{ height: `${h}%` }} className="w-6 rounded-t-lg" />
      ))}
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="glass rounded-xl p-4">
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 py-2">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
