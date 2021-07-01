const { ref, onMounted, onUpdated } = Vue

const app = Vue.createApp({
  setup(props, context) {
    // mode
    // 0 = student
    // 1 = science club
    const mode = ref(0)
    const input = ref({
      id: 'A2020000001',
      name: '桐生ココ',
      dep: '一擊必殺科',
      avatar: null,
      lab: '01'
    })
    let canvas = null
    let ctx = null
    let templates = []

    const date = new Date()
    const dateText = ref(date.toISOString().split('T')[0].replace(/-/g, '/'))
    const dateYear = ref(date.getFullYear())

    const selectMode = (value, e) => {
      e.preventDefault()
      mode.value = value
      location.hash = '#mode' + value
    }

    const handleFile = (e) => {
      const reader = new FileReader()
      input.value.file = e.target.files[0]
      reader.onload = (ee) => {
        const img = new Image()
        img.onload = () => {
          refresh()
        }
        img.src = ee.target.result
        input.value.avatar = img
      }
      reader.readAsDataURL(e.target.files[0])
    }

    const refresh = () => {
      switch(mode.value) {
        case 0:
          ctx.font = '50px Arial'
          // Clear
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // Background
          ctx.drawImage(templates[0], 0, 0)
          // Draw Texts
          const fonts = 'dfkai-sb, KaiTi, stkaiti, 標楷體, 华文楷体, cwTeXKai, Arial, cursive, "Ma Shan Zheng", hkkaikk'
          colorText(input.value.id, canvas.width/2 + 450, 500, 'black', '60px ' + fonts, 'center')
          colorText(input.value.dep, canvas.width/2 + 450, 670, 'black', '120px ' + fonts, 'center')
          colorText(input.value.name, canvas.width/2 + 390, 950, 'black', '170px ' + fonts, 'center')
          // Draw avatar
          if(input.value.avatar) {
            const ratio = 600 / input.value.avatar.width
            ctx.save()
            roundedImage(120, 430, 600, input.value.avatar.height * ratio, 30)
            ctx.clip()
            ctx.drawImage(input.value.avatar, 120, 430, 600, input.value.avatar.height * ratio)
            ctx.restore()
          }
          break
        case 1:
          // Clear
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          // Background
          ctx.drawImage(templates[1], 0, 0)
          // Draw Texts
          colorText(input.value.name, 570, 280, 'white', '35px SweiSans', 'start')
          colorText(input.value.id, 475, 330, 'white', '35px SweiSans', 'start')
          colorText(input.value.lab, 760, 468, 'white', '70px Archicoco', 'start')
          // Draw avatar
          if(input.value.avatar) {
            const ratio = 300 / input.value.avatar.width
            ctx.save()
            roundedImage(50, 80, 300, input.value.avatar.height * ratio, 15)
            ctx.clip()
            ctx.drawImage(input.value.avatar, 50, 80, 300, input.value.avatar.height * ratio)
            ctx.restore()
          }
          break
      }
    }

    const colorText = (text, x, y, color, font, align) => {
      ctx.font = font
      ctx.textAlign = align
      ctx.fillStyle = color
      ctx.fillText(text, x, y)
    }

    const download = () => {
      const link = document.createElement('a')
      link.download = 'Asacoco.png'
      link.href = canvas.toDataURL()
      link.click()
    }

    const loadImage = (url) => {
      return new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
          resolve(image)
        }
        image.src = url
      })
    }

    const roundedImage = (x, y, width, height, radius) => {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    onMounted(async () => {
      await document.fonts.load('10pt "Ma Shan Zheng"')
      await document.fonts.load('10pt cwTeXKai')
      await document.fonts.load('10pt hkkaikk')
      await document.fonts.load('10pt Archicoco')
      await document.fonts.load('10pt SweiSans')
      templates[0] = await loadImage('./images/templates/ACU.png')
      templates[1] = await loadImage('./images/templates/science.png')
      input.value.avatar = await loadImage('./images/default_avatar.png')
      const id = parseInt(location.hash.slice(1).replace('mode', ''))
      if(!isNaN(id) && id < 2) mode.value = id
      else location.hash = '#mode0'
      canvas = document.querySelectorAll('.canvas')[mode.value]
      ctx = canvas.getContext('2d')
      refresh()
    })

    onUpdated(() => {
      canvas = document.querySelectorAll('.canvas')[mode.value]
      ctx = canvas.getContext('2d')
      refresh()
    })

    return {
      mode,
      input,
      canvas,
      ctx,
      dateText,
      dateYear,
      selectMode,
      handleFile,
      refresh,
      date,
      download
    }
  }
}).mount('#app')