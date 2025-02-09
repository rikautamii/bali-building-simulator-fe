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
          className={`bg-primary py-[20px] md:py-[15px] my-10 md:my-5 rounded-[5px] cursor-pointer ${
            menu === "2" && "bg-secondary"
          }`}
        >
          <p className="text-white text-center text-[14px] md:text-[16px] font-display">
            Letak Pintu Pekarangan
          </p>
        </div>
        <div
          onClick={() => handleMenu("3")}
          className={`bg-primary py-[20px] md:py-[15px] my-10 md:my-5 rounded-[5px] cursor-pointer ${
            menu === "3" && "bg-secondary"
          }`}
        >
          <p className="text-white text-center text-[14px] md:text-[16px] font-display">
            Tata Letak Bangunan
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
      "http://localhost:9000/api/locationDoor",
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
          <label for="panjang" class="block text-primary font-medium">Panjang Pekarangan (m)</label>
          <input
            type="text"
            id="panjang"
            pattern="^\d*(\.\d{0,5})?$"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan panjang"
            onChange={(e) => setYardLength(e.target.value)}
            required
          />
      </div>

      <div class="mb-6">
      <label for="arah" class="block text-primary font-medium">Arah Lahan</label>
        <select
          className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
          id="arah"
          onChange={(e) => setLandDirection(e.target.value)}
        >
          <option value="utara">Utara</option>
          <option value="timur">Timur</option>
          <option value="selatan">Selatan</option>
          <option value="barat">Barat</option>
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
          Proses
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
                Filosofi Letak Setiap Pintu
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
  const [landDirection, setLandDirection] = React.useState("utara");
  const [BaliOrientation, setBaliOrientation] = React.useState("baliutara");
  const [footLength, setFootLength] = React.useState(0);
  const [sideFootLength, setSideFootLength] = React.useState(0);
  const [image, setImage] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [landLength, setLandLength] = React.useState(0);
  const [landWidth, setLandWidth] = React.useState(0);
  const [landArea, setLandArea] = React.useState(null);

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

    const fields = { landDirection, footLength, sideFootLength, landLength, landWidth, BaliOrientation };

    setLoading(true);

    const response = await fetch(
      "http://localhost:9000/api/buildingLocation",
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
    }
  };

  return (
    <div className="bg-white shadow-lg rounded p-6 max-w-5xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label for="letak" class="block text-primary font-medium">Arah Letak Pintu</label>
          <select
            id="letak"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            onChange={(e) => setLandDirection(e.target.value)}
          >
            <option value="utara">Utara</option>
            <option value="timur">Timur</option>
            <option value="selatan">Selatan</option>
            <option value="barat">Barat</option>
          </select>
        </div>

        <div class="mb-6">
          <label for="orientasi" class="block text-primary font-medium">Orientasi Lahan</label>
            <select
              className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
              id="orientasi"
              onChange={(e) => setBaliOrientation(e.target.value)}
            >
              <option value="baliutara">Bali Utara</option>
              <option value="baliselatan">Bali Selatan</option>
            </select>
        </div>

        <div className="mb-4">
          <label for="panjangtk" class="block text-primary font-medium">Panjang Telapak Kaki / A Tampak Batis (cm)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="panjangtk"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan panjang"
            onChange={(e) => setFootLength(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label for="lebar" class="block text-primary font-medium">Lebar Telapak Kaki / A Tampak Batis Ngandang (cm)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="lebar"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan lebar"
            onChange={(e) => setSideFootLength(parseFloat(e.target.value))}
            required
          />
        </div>

        <div className="mb-4">
          <label for="plahan" class="block text-primary font-medium">Panjang Lahan (m)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="landLength"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan panjang lahan"
            onChange={(e) => setLandLength(parseFloat(e.target.value) || 0)} 
            required
          />
        </div>

        <div className="mb-4">
          <label for="llahan" class="block text-primary font-medium">Lebar Lahan (m)</label>
          <input
            type="number"
            pattern="^\d*(\.\d{0,5})?$"
            id="landWidth"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            placeholder="Masukkan lebar lahan"
            onChange={(e) => setLandWidth(parseFloat(e.target.value) || 0)}
            required
          />
        </div>

        {landArea !== null && (
          <p className="text-lg font-semibold text-primary">Luas Lahan: {landArea} m²</p>
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
          Proses
        </button>

        {image && (
          <img
            className="col-span-2 mt-4"
            src={image}
            alt="Tata Letak Bangunan Bali"
          />
        )}
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
              Letak Pintu Pekarangan
            </p>
          </div>
          <div
            onClick={() => handleMenu("3")}
            className={`bg-primary py-[8px] md:py-[10px] my-4 md:my-0 rounded-[5px] cursor-pointer ${
              menu === "3" && "bg-secondary"
            }`}
          >
            <p className="text-white text-center text-[14px] md:text-[16px] font-display">
              Tata Letak Bangunan
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
