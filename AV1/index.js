const express = require('express')
const mongoose = require('mongoose')
const Maps = require('./models/maps.js')

const app = express()

app.use(
    express.urlencoded({
      extended: true,
    }),
  )

  app.use(express.json())
  app.post('/newlocation', async (req, res) => {
        const {name, location} = req.body
        const markers = {name, location}

        try {
            await Maps.create(markers)
            res.status(201).json({ message: 'Enderço inserido no sistema com sucesso!' })
          } catch (error) {
            res.status(500).json({ erro: error })
          }
        })
         
  
app.get('/location', async (req, res) => {
    try {
      const locale = await Maps.find()
      res.status(200).json(locale)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  }) 

  app.get('/location:id', async (req, res) => {
    const id = req.params.id
    try {
      const markers = await Maps.findOne({ _id: id })
      if (!markers) {
        res.status(422).json({ message: 'Endereço não encontrado!' })
        return
      }
      res.status(200).json(markers)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
  })

  app.patch('/updatelocation:id', async (req, res) => {
    const id = req.params.id
    const { name, location} = req.body
    const markers = {name, location}

    try {
        const updatedMarkers = await Maps.updateOne({ _id: id }, markers)
        if (updatedMarkers.matchedCount === 0) {
          res.status(422).json({ message: 'Endereço não encontrado!' })
          return
        }
        res.status(200).json(markers)
      } catch (error) {
        res.status(500).json({ erro: error })
      }
    })

    app.delete('/deletelocation:id', async (req, res) => {
        const id = req.params.id
        const markers = await Maps.findOne({ _id: id })
        if (!markers) {
          res.status(422).json({ message: 'Endereço não encontrado!' })
          return
        }
        try {
          await Maps.deleteOne({ _id: id })
          res.status(200).json({ message: 'Endereço removido com sucesso!' })
        } catch (error) {
          res.status(500).json({ erro: error })
        }
      }) 
    app.get("/", (req, res) => {
        res.json({ message: "Oi Express!" });
      });
      mongoose.connect(
        'mongodb+srv://leandrosalesk:7umALYSF0DXtHvDN@aula.asqkulf.mongodb.net/Maps?retryWrites=true&w=majority',
      )
      .then(() => {
        console.log('Conectou ao banco!')
        app.listen(3000)
      })
      .catch((err) => console.log(err))