const app = document.getElementById("app");

function App() {
  const [menu, setMenu] = React.useState("1");

  function handleMenu(menu) {
    setMenu(menu);
  }

  return (
    <div>
      <div class="text-center mb-6">
        <img src="logo.png" alt="Logo" class="mx-auto h-12 mb-4" />
        <h2 class="text-primary font-semibold text-2xl">Asta Kosala Kosali</h2>
        <p class="text-gray-600">Bali Building Simulator</p>
      </div>
      <div className="button-container">
        <div
          onClick={() => handleMenu("2")}
          className={`bg-primary py-[20px] px-[30px] md:py-[15px] md:px-[40px] my-10 md:my-5 rounded-[5px] cursor-pointer ${
            menu === "2" && "bg-secondary"
          }`}
        >
          <p className="text-white text-center text-[14px] md:text-[16px] font-display">
            Location of Yard Door
          </p>
        </div>
        <div
          onClick={() => handleMenu("3")}
          className={`bg-primary py-[20px] px-[30px] md:py-[15px] md:px-[40px] my-10 md:my-5 rounded-[5px] cursor-pointer ${
            menu === "3" && "bg-secondary"
          }`}
        >
          <p className="text-white text-center text-[14px] md:text-[16px] font-display">
            Building Layout
          </p>
          </div>
      </div>
      {menu === "2" && <Menu2 />}
      {menu === "3" && <Menu3 />}
    </div>
  );
}

const container = document.getElementById("app");
ReactDOM.render(<App />, container);

function Menu2() {
  const [yardLength, setYardLength] = React.useState(0);
  const [landDirection, setLandDirection] = React.useState("utara");
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fields = { yardLength, landDirection };

    setLoading(true);

    const response = await fetch(
      "https://bali-building-simulator-api-7n41.vercel.app/api/locationDoor",
      {
        method: "POST",
        body: JSON.stringify(fields),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();

    if (response.ok) {
      setData(json);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded p-6 max-w-4xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label for="panjang" class="block text-primary font-medium">Yard Length (m)</label>
          <input
            type="text"
            id="panjang"
            pattern="^\d*(\.\d{0,5})?$"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter yard length"
            onChange={(e) => setYardLength(e.target.value)}
            required
          />
      </div>

      <div class="mb-6">
      <label for="arah" class="block text-primary font-medium">Land Direction</label>
        <select
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          id="arah"
          onChange={(e) => setLandDirection(e.target.value)}
        >
          <option value="utara">North</option>
          <option value="timur">East</option>
          <option value="selatan">South</option>
          <option value="barat">West</option>
        </select>
      </div>

        <button
          className={`w-full inline-flex items-center justify-center bg-primary text-white text-[14px] md:text-[16px] py-[8px] md:py-[10px] rounded-[5px] mt-[20px] md:mt-[30px] ${
            loading && "bg-primary/80 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          <svg
            className={`w-5 h-5 mr-3 -ml-1 text-white animate-spin ${
              !loading && "hidden"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Process
        </button>
        {data && (
          <div className="md:col-span-2 lg:grid lg:grid-cols-5 gap-2 mt-4">
            <img
              className="col-span-3"
              src={`data:image/png;base64,${data.bytesImg}`}
              alt="Letak Pintu"
            />
            <div className="col-span-2 bg-primary rounded-md p-4 text-white my-4 lg:my-0 text-[14px] md:text-[16px]">
              <p className="uppercase font-semibold">
                Philosophy of the Location of Each Yard Door
              </p>
              {Object.entries(data.philosophy).map(([k, v]) => (
                <p key={k}>{`${k}. ${v.bhsBali} = ${v.bhsIndonesia} (${v.locationValue})`}</p>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

function Menu3() {
  const [landDirection, setLandDirection] = React.useState("north");
  const [BaliOrientation, setBaliOrientation] = React.useState("baliutara");
  const [footLength, setFootLength] = React.useState(0);
  const [sideFootLength, setSideFootLength] = React.useState(0);
  const [image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [landLength, setLandLength] = React.useState(0);
  const [landWidth, setLandWidth] = React.useState(0);
  const [landArea, setLandArea] = React.useState(null);
  const [history, setHistory] = React.useState(() => {
    return JSON.parse(localStorage.getItem("landHistory")) || [];
  });

  const calculateArea = () => {
    if (!isNaN(landLength) && !isNaN(landWidth) && landLength > 0 && landWidth > 0) {
      setLandArea((landLength * landWidth).toFixed(2));
    } else {
      setLandArea(null);
    }
  };

  React.useEffect(() => {
    calculateArea();
  }, [landLength, landWidth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (landLength < 10 || landWidth < 10) {
      Swal.fire({
        icon: "warning",
        title: "The land size is too small!",
        text: "Make sure the length and width of the land is at least 10 meters.",
      });
      return;
    }

    const fields = { landDirection, footLength, sideFootLength, landLength, landWidth, BaliOrientation };

    setLoading(true);

    const response = await fetch(
      "https://bali-building-simulator-api-7n41.vercel.app/api/buildingLocation",
      {
        method: "POST",
        body: JSON.stringify(fields),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    
    

    if (response.ok) {
      setImage(`data:image/png;base64,${json.bytesImg}`);
      setLoading(false);

      const newEntry = {
        landDirection,
        BaliOrientation,
        landLength,
        landWidth,
        footLength, sideFootLength,
        landArea: (landLength * landWidth).toFixed(2),
        result11: (3 * footLength + sideFootLength) / 100,
        result12: (16 * footLength + sideFootLength) / 100,
        result13: (5 * footLength + sideFootLength) / 100,
        result14: (9 * footLength + sideFootLength) / 100,
        result15: (8 * footLength + sideFootLength) / 100,
        result16: (15 * footLength + sideFootLength) / 100,
        result17: (6 * footLength + sideFootLength) / 100,
        result18: (22 * footLength + sideFootLength) / 100,
        result19: (25 * footLength + sideFootLength) / 100,
        result10: (7 * footLength + sideFootLength) / 100,
        result21: (11 * footLength + sideFootLength) / 100,
        result22: (24 * footLength + sideFootLength) / 100,
        result23: (13 * footLength + sideFootLength) / 100,
        result24: (17 * footLength + sideFootLength) / 100,
        result25: (16 * footLength + sideFootLength) / 100,
        result26: (23 * footLength + sideFootLength) / 100,
        result27: (14 * footLength + sideFootLength) / 100,
        result28: (30 * footLength + sideFootLength) / 100,
        result29: (33 * footLength + sideFootLength) / 100,
        result20: (15 * footLength + sideFootLength) / 100,
        result31: (19 * footLength + sideFootLength) / 100,
        result32: (32 * footLength + sideFootLength) / 100,
        result33: (21 * footLength + sideFootLength) / 100,
        result34: (25 * footLength + sideFootLength) / 100,
        result35: (24 * footLength + sideFootLength) / 100,
        result36: (31 * footLength + sideFootLength) / 100,
        result37: (22 * footLength + sideFootLength) / 100,
        result38: (38 * footLength + sideFootLength) / 100,
        result39: (41 * footLength + sideFootLength) / 100,
        result30: (23 * footLength + sideFootLength) / 100,
      };

      
      const updatedHistory = [newEntry, ...history.slice(0, 4)]; 
      setHistory(updatedHistory);
      localStorage.setItem("landHistory", JSON.stringify(updatedHistory));
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem("landHistory");
    setHistory([]); 
  };

  return (
    <div className="bg-white shadow-lg rounded p-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label for="letak" class="block text-primary font-medium">Gate Direction</label>
          <select
            id="letak"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setLandDirection(e.target.value)}
          >
            <option value="north">North</option>
            <option value="east">East</option>
            <option value="south">South</option>
            <option value="west">West</option>
          </select>
        </div>

        <div class="mb-6">
          <label for="orientasi" class="block text-primary font-medium">Land Orientation</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              id="orientasi"
              onChange={(e) => setBaliOrientation(e.target.value)}
            >
              <option value="baliutara">North Bali</option>
              <option value="baliselatan">South Bali</option>
            </select>
        </div>

        <div className="mb-4">
          <label for="panjangtk" class="block text-primary font-medium">Foot Length (cm)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="panjangtk"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter foot length"
            onChange={(e) => setFootLength(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label for="lebar" class="block text-primary font-medium">Side Foot Length (cm)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="lebar"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter side foot length"
            onChange={(e) => setSideFootLength(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label for="plahan" class="block text-primary font-medium">Land Length (m)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="landLength"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter land length"
            onChange={(e) => setLandLength(parseFloat(e.target.value) || 0)} 
            required
          />
        </div>

        <div className="mb-4">
          <label for="llahan" class="block text-primary font-medium">Land Width (m)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="landWidth"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Enter land width"
            onChange={(e) => setLandWidth(parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        {landArea !== null && (
          <p className="text-lg font-semibold text-primary">Land Area: {landArea} m²</p>
        )}

        <button
          className={`w-full inline-flex items-center justify-center bg-primary text-white text-[14px] md:text-[16px] py-[8px] md:py-[10px] rounded-[5px] mt-[20px] md:mt-[40px] ${
            loading && "bg-primary/80 cursor-not-allowed"
          }`}
          disabled={loading}
        >
          <svg
            className={`w-5 h-5 mr-3 -ml-1 text-white animate-spin ${
              !loading && "hidden"
            }`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Process
        </button>

        {image && (
          <img
            className="col-span-2 mt-4"
            src={image}
            alt="Tata Letak Bangunan Bali"
          />
        )}

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-primary">Search History</h2>
          {history.length > 0 ? (
            <table className="w-full mt-4 border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-primary">
                  <th className="border border-gray-300 px-4 py-2 text-xs">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2 text-xs">Input</th>
                  <th className="border border-gray-300 px-20 py-2 text-xs">Building Distance</th>
                  <th className="border border-gray-300 px-20 py-2 text-xs">Formula</th>
                  <th className="border border-gray-300 px-4 py-2 text-xs">Calculation Results</th>
                </tr>
              </thead>
              <tbody>
              {history.map((entry, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 px-2 py-2 text-xs text-left">
                    Door Direction <br />
                    Foot Length (cm) <br />
                    Side Foot Length (cm) <br />
                    Land Length (m) <br />
                    Land Width (m) <br />
                    Land Area (m²) <br />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-xs text-left">
                    {entry.landDirection} <br />
                    {entry.footLength} <br />
                    {entry.sideFootLength} <br />
                    {entry.landLength} <br />
                    {entry.landWidth} <br />
                    {entry.landArea} <br />
                    </td>
                  <td className="border border-gray-300 px-2 py-2 text-xs text-left">
                    merajan - bale daja <br />
                    bale daja - tembok <br />
                    bale daje - bale delod <br />
                    bale kauh - bale kangin <br />
                    bale daja - tembok <br />
                    bale daja - bale dauh <br />
                    bale dauh - dapur <br />
                    bale daja - dapur <br />
                    bale daja - jineng <br />
                    penunggun karang - tembok <br />
                  </td>
                  <td className="border border-gray-300 px-2 py-2 text-left text-xs">
                  {entry.landLength >= 10 && entry.landLength <= 12 && 
                  entry.landWidth >= 10 && entry.landWidth <= 11 ? (
                    <>
                      3 * footLength + sideFootLength (Guru) <br />
                      16 * footLength + sideFootLength (Uma) <br />
                      5 * footLength + sideFootLength (Rudra) <br />
                      9 * footLength + sideFootLength (Sri) <br />
                      8 * footLength + sideFootLength (Uma) <br />
                      15 * footLength + sideFootLength (Kala) <br />
                      6 * footLength + sideFootLength (Brahma) <br />
                      22 * footLength + sideFootLength (Brahma) <br />
                      25 * footLength + sideFootLength (Sri) <br />
                      7 * footLength + sideFootLength (Kala)
                      </>
                    ) : entry.landLength >= 13 && entry.landLength <= 16 && 
                    entry.landWidth >= 12 && entry.landWidth <= 13 ? (
                      <>
                      11 * footLength + sideFootLength (Guru) <br />
                      24 * footLength + sideFootLength (Uma) <br />
                      13 * footLength + sideFootLength (Rudra) <br />
                      17 * footLength + sideFootLength (Sri) <br />
                      16 * footLength + sideFootLength (Uma) <br />
                      23 * footLength + sideFootLength (Kala) <br />
                      14 * footLength + sideFootLength (Brahma) <br />
                      30 * footLength + sideFootLength (Brahma) <br />
                      33 * footLength + sideFootLength (Sri) <br />
                      15 * footLength + sideFootLength (Kala)
                      </>
                    ) : (
                      <>
                      19 * footLength + sideFootLength (Guru) <br />
                      24 * footLength + sideFootLength (Uma) <br />
                      13 * footLength + sideFootLength (Rudra) <br />
                      17 * footLength + sideFootLength (Sri) <br />
                      16 * footLength + sideFootLength (Uma) <br />
                      23 * footLength + sideFootLength (Kala) <br />
                      14 * footLength + sideFootLength (Brahma) <br />
                      30 * footLength + sideFootLength (Brahma) <br />
                      33 * footLength + sideFootLength (Sri) <br />
                      15 * footLength + sideFootLength (Kala)
                      </>
                    )}
                  </td>
                  <td className="border border-gray-300 px-7 py-2 text-left text-xs">
                  {entry.landLength >= 10 && entry.landLength <= 12 && 
                  entry.landWidth >= 10 && entry.landWidth <= 11 ? (
                    <>
                      {entry.result11} <br />
                      {entry.result12} <br />
                      {entry.result13} <br />
                      {entry.result14} <br />
                      {entry.result15} <br />
                      {entry.result16} <br />
                      {entry.result17} <br />
                      {entry.result18} <br />
                      {entry.result19} <br />
                      {entry.result10}
                      </>
                    ) : entry.landLength >= 13 && entry.landLength <= 16 && 
                    entry.landWidth >= 12 && entry.landWidth <= 13 ? (
                      <>
                        {entry.result21} <br />
                        {entry.result22} <br />
                        {entry.result23} <br />
                        {entry.result24} <br />
                        {entry.result25} <br />
                        {entry.result26} <br />
                        {entry.result27} <br />
                        {entry.result28} <br />
                        {entry.result29} <br />
                        {entry.result20}
                      </>
                    ) : (
                      <>
                        {entry.result31} <br />
                        {entry.result32} <br />
                        {entry.result33} <br />
                        {entry.result34} <br />
                        {entry.result35} <br />
                        {entry.result36} <br />
                        {entry.result37} <br />
                        {entry.result38} <br />
                        {entry.result39} <br />
                        {entry.result30}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          ) : (
            <p className="text-gray-500">There is no search history yet.</p>
          )}
        </div>

        <button 
        onClick={clearLocalStorage} 
        className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Clear History
        </button>


      </form>
    </div>
  );
}

function Simulator() {
  const [menu, setMenu] = React.useState("1");

  function handleMenu(menu) {
    setMenu(menu);
  }

  return (
    <div className="max-w-[1240px] mx-auto">
      <div className="p-2">
        <div className="pt-[20px] md:grid md:grid-cols-3 md:gap-[20px]">
          <div
            onClick={() => handleMenu("2")}
            className={`bg-primary py-[8px] md:py-[10px] my-4 md:my-0 rounded-[5px] cursor-pointer ${
              menu === "2" && "bg-secondary"
            }`}
          >
            <p className="text-white text-center text-[14px] md:text-[16px] font-display">
              Location of Yard Door
            </p>
          </div>
          <div
            onClick={() => handleMenu("3")}
            className={`bg-primary py-[8px] md:py-[10px] my-4 md:my-0 rounded-[5px] cursor-pointer ${
              menu === "3" && "bg-secondary"
            }`}
          >
            <p className="text-white text-center text-[14px] md:text-[16px] font-display">
              Building Layout
            </p>
          </div>
        </div>
        <div>
          {menu === "2" ? <Menu2 /> : <Menu3 />} 
        </div>
      </div>
    </div>
  );
}
