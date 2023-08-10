const express = require('express')
const { Parser: dataExporter } = require('json2csv')

const app = express()

async function downloadCSVFile(data) {
  const fileHeaders = [
    Object.keys(data[0]).map((key) => ({
      id: key,
      title: key.charAt(0).toUpperCase() + key.slice(1),
    })),
  ]
  const jsonData = new dataExporter({ fileHeaders })
  const csvData = jsonData.parse(data)
  return csvData
}

function formatDateToDdMmYyyy(inputDate) {
  const date = new Date(inputDate)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  return `${day}-${month}-${year}`
}

app.get('/test', async (req, res) => {
  const result = [
    {
      policy_number: 'INS-POL-015',
      sum_assured: '35000000.00',
      policy_start_date: '2023-07-31T23:00:00.000Z',
      policy_end_date: '2024-08-02T23:00:00.000Z',
      phone1: '+2347067777777',
      email: 'athens.clayten@dropedfor.com',
      occupation: 'Software Engineer',
      employer_address: '15B Joseph Street, Marina, Lagos Island',
      amount: '1225000.00',
      mode_of_payment: 'Cash',
      product_name: 'AUTO CLASSIC',
      remark: null,
      settled_amount: '30000.00',
      settlement_date: '2023-08-04T14:46:06.400Z',
      firstname: 'Hugo',
      lastname: ' Holgate',
    },
  ]

  const payload = result.map(
    ({
      firstname,
      policy_end_date,
      settlement_date,
      policy_start_date,
      lastname,
      ...rest
    }) => ({
      ...rest,
      insured: `${firstname} ${lastname}`,
      policy_start_date: formatDateToDdMmYyyy(policy_start_date),
      policy_end_date: formatDateToDdMmYyyy(policy_end_date),
      settlement_date: formatDateToDdMmYyyy(settlement_date),
    })
  )

  console.log(payload)

  const filename = `${'test' || ''} policy.csv`
  const csvData = await downloadCSVFile([...payload])
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  return res.status(200).end(csvData)
})

app.listen(6565, () => console.log('http://localhost:6565/test'))