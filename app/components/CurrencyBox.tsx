export function CurrencyBox() {
  return (
    <div className="rounded-lg p-4">
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-gray-900 dark:text-gray-200">
        Curs valutar
      </h3>

      <div className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">EUR</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            5.09
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">USD</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            4.33
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">GBP</span>
          <span className="font-semibold text-gray-900 dark:text-gray-200">
            5.80
          </span>
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">Actualizat azi (demo)</div>
    </div>
  );
}
