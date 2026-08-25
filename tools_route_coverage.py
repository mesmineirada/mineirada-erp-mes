from pathlib import Path
import re

text = Path('/home/ubuntu/mineirada-replica/client/src/App.tsx').read_text()
menu = sorted(set(re.findall(r'href: "([^"]+)"', text)))
exact = set(re.findall(r'location === "([^"]+)"', text))
prefix = set(re.findall(r'location\.startsWith\("([^"]+)"\)', text))
covered = {route for route in menu if route in exact or any(route.startswith(p) for p in prefix)}
missing = sorted(set(menu) - covered)
print(f'menu_routes={len(menu)} covered={len(covered)} missing={len(missing)}')
if missing:
    print('MISSING')
    print('\n'.join(missing))
    raise SystemExit(1)
print('ALL_MENU_ROUTES_COVERED')
