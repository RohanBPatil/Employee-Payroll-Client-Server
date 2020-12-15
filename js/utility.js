const stringifyDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const newDate = !date ? "undefined" : (new Date(Date.parse(date)).toLocaleDateString("en-US", options));
    console.log(newDate);
    return newDate;
}