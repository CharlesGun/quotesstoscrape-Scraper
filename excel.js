const excel = require("exceljs")

module.exports = {
    makeExcel: async(data) => {
        try {
            let workbook = new excel.Workbook()
            const sheet = workbook.addWorksheet("quotes")
            sheet.columns = [
                {header:"Quotes", key:"quotes",width:50},
                {header:"Tags", key:"tags"},
                {header:"Authors", key:"authors",width:20},
                {header:"Author's Born Date", key:"authorBornDate",width:25},
                {header:"Author's Born Loc", key:"authorBornLoc",width:25},
                {header:"Link Author's Detail", key:"linkAuthors",width:50},
            ]

            await data.map((value)=>{
                sheet.addRow({quotes: value.quotes, tags: value.tags, authors: value.authors, authorBornDate: value.authorBornDate, authorBornLoc: value.authorBornLoc, linkAuthors: value.linkAuthors})
            })

            await workbook.xlsx.writeFile("QuotesScrapeValue.xlsx")
            console.log("Write Data Success");
        } catch (error) {
            console.log(error);
        }
    }
}