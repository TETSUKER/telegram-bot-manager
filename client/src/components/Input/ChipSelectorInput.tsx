import React from "react";
import ReactDOM from "react-dom";

interface ChipSelectorInputProps<T = string> {
  options: { value: T; text: string }[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: T[];
  onChange: (value: T[]) => void;
}

export function ChipSelector<T = string>({
  options: propsOptions,
  label,
  placeholder = "Select or add...",
  disabled = false,
  value,
  onChange,
}: ChipSelectorInputProps<T>): React.JSX.Element {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [options, setOptions] = React.useState(propsOptions);
  const selected = value ? value : [];
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [dropdownPos, setDropdownPos] = React.useState<{
    top: number;
    left: number;
    width: number;
  }>({
    top: 0,
    left: 0,
    width: 0,
  });

  React.useEffect(() => {
    setOptions(propsOptions);
  }, [propsOptions]);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  const updateDropdownPosition = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const toggleDropdown = () => {
    if (!disabled) {
      updateDropdownPosition();
      setDropdownOpen((v) => !v);
    }
  };

  const removeChip = (value: T) => {
    onChange(selected.filter((v) => v !== value));
  };

  const selectOption = (value: T) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setDropdownOpen(false);
  };

  const filteredOptions = options.filter((o) => !selected.includes(o.value));

  return (
    <div className="flex flex-col gap-y-2 w-full" ref={containerRef}>
      {label && (
        <span className="font-normal text-slate-300 text-[16px]">{label}</span>
      )}
      <div
        tabIndex={0}
        className={[
          "relative flex flex-wrap items-center gap-1 bg-transparent border border-slate-300 text-slate-300 p-[4px] rounded-[5px]",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
        ].join(" ")}
        onClick={toggleDropdown}
        onKeyDown={(e) => {
          if (
            (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") &&
            !dropdownOpen
          ) {
            e.preventDefault();
            updateDropdownPosition();
            setDropdownOpen(true);
          }
        }}
        aria-disabled={disabled}
      >
        {selected.length === 0 && (
          <span className="text-slate-400 px-[6px]">{placeholder}</span>
        )}
        {selected.map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <span
              key={String(value)}
              className="flex items-center border border-slate-300 text-slate-300 rounded-full px-3 py-[2px] text-[14px] mr-1"
            >
              {option?.text || String(value)}
              {!disabled && (
                <button
                  type="button"
                  className="ml-2 text-slate-300 hover:text-slate-500 focus:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeChip(value);
                  }}
                  tabIndex={-1}
                >
                  ×
                </button>
              )}
            </span>
          );
        })}

        <span className="ml-auto pl-2 flex items-center absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            className="text-slate-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8L10 12L14 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {dropdownOpen &&
        ReactDOM.createPortal(
          <div
            className="absolute bg-slate-900 border border-slate-300 rounded-[5px] shadow-lg max-h-52 overflow-auto z-[9999]"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              position: "absolute",
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <div
                  key={String(option.value)}
                  className="px-4 py-1 cursor-pointer hover:bg-blue-500 hover:text-white text-slate-300"
                  onMouseDown={() => selectOption(option.value)}
                >
                  {option.text}
                </div>
              ))
            ) : (
              <div className="px-4 py-1 text-slate-400 italic">
                No available options
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
