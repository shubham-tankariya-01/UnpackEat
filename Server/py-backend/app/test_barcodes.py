
import httpx
import time

BARCODES = [
    "3017620422003",
    "4008400402222",
    "5000112548167",
    "5000159484695",
    "5449000000996",
    "5449000131805",
    "7622210449283",
    "8901058023800",
    "8901063367319",
    "8901262130325",
    "8901595971220",
    "8901719130144",
    "8903363001092",
    "8903363006820",
    "8904004400779",
    "8904109490538",
    "8906010500047",
    "8906010500139",
    "8906010500207",
    "8906010500320",
    "8906010500511",
    "8906010501570",
    "8906010503574",
    "8906010505028",
    "8906010505196",
    "8906010505202",
    "8906010505219",
    "8906010505509",
    "8908005144632",
]


BASE_URL = "http://localhost:8000/product"

def test_barcodes(debug: bool = False):
    mode_label = "DEBUG" if debug else "NORMAL"
    print(f"\n🔍 Mode: {mode_label} | Testing {len(BARCODES)} barcodes...\n")
    if debug:
        print("  [debug] Raw OpenFoodFacts responses will be saved to data/raw/\n")

    ok = fail = 0

    with httpx.Client(timeout=30.0) as client:
        for code in BARCODES:
            try:
                print(f"  Fetching {code}...", end=" ", flush=True)
                start_time = time.time()

                url = f"{BASE_URL}/{code}" + ("?debug=true" if debug else "")
                response = client.get(url)
                duration = time.time() - start_time

                if response.status_code == 200:
                    data = response.json()
                    name   = data.get("product", {}).get("name", "Unknown")[:28]
                    h      = data.get("highlights", {})
                    score  = h.get("health_score", "?")
                    likes  = len(h.get("likes", []))
                    issues = len(h.get("concerns", []))
                    ok += 1
                    print(f"✅ ({duration:.2f}s)  score={score:>3}  👍{likes} ⚠️{issues}  {name}")
                    if debug:
                        concerns = h.get("concerns", [])
                        if concerns:
                            print(f"          concerns: {', '.join(concerns)}")
                else:
                    fail += 1
                    print(f"❌ {response.status_code} ({duration:.2f}s)  {response.text[:80]}")

            except Exception as e:
                fail += 1
                print(f"❌ Error: {e}")

    print(f"\n{'─'*55}")
    print(f"  Results: {ok} passed / {fail} failed / {len(BARCODES)} total")
    print(f"{'─'*55}\n")

if __name__ == "__main__":
    answer = input("Enable debug mode? Saves raw OFF responses to data/raw/ [y/N]: ").strip().lower()
    debug = answer in ("y", "yes")
    test_barcodes(debug=debug)


# 3017620422003
# 4008400402222
# 5000112548167
# 5000159484695
# 5449000000996
# 5449000131805
# 7622210449283
# 8901058023800
# 8901063367319
# 8901262130325
# 8901595971220
# 8901719130144
# 8903363001092
# 8903363006820
# 8904004400779
# 8904109490538
# 8906010500047
# 8906010500139
# 8906010500207
# 8906010500320
# 8906010500511
# 8906010501570
# 8906010503574
# 8906010505028
# 8906010505196
# 8906010505202
# 8906010505219
# 8906010505509
# 8908005144632