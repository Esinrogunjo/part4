const { reverse } = require("../utils/for_testing");
describe("Reverse Test Suit", () => {
  test("reverse of a", () => {
    const result = reverse("a");

    expect(result).toBe("a");
  });

  test("reverse of react", () => {
    const result = reverse("react");

    expect(result).toBe("tcaer");
  });

  test("reverse of releveler", () => {
    const result = reverse("releveler");

    expect(result).toBe("releveler");
  });

  test("palindrom of react", () => {
    const result = reverse("react");

    expect(result).toBe("tcaer");
  });

  test("agas", () => {
    expect(reverse("agastech")).toBe("hcetsaga");
  });
});
