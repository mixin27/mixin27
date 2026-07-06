# Pricing Calculator Presets

## Where to add new presets
- Add or edit presets in `presets.ts`.
- Base scope items live in `data.ts`.
- Types are defined in `types.ts`.
- Payment terms presets live in `payment-terms.ts`.

## Preset structure
Each preset is a `Template` with:
- `label`: Display name in the dropdown.
- `note`: Short description shown under the dropdown.
- `defaultPackage`: One of `mvp`, `standard`, `advanced`.
- `features`: Feature list with day ranges.
- `packages`: Which features are selected for each package.

## How to add a new preset
1. Add a new entry to `templates` in `presets.ts`.
2. Add the preset key to `presetOrder` to control dropdown order.

## Tips
- Keep feature `id` values unique within a preset.
- Use consistent day ranges to keep estimates stable.
