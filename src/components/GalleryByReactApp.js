'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');


var imageDatas = require('../data/imageDatas.json');
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0; i < imageDatasArr.length; i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
})(imageDatas);

function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30°之间的随机值
function get30DegRandom() {
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}


var ImgFigure = React.createClass({
  handleClick: function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render: function () {
    var styleObj = {};

    if (this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if (this.props.arrange.rotate) {
      (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if (this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
          alt={this.props.data.title}
          />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick} >
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    );
  }
});


var ControllerUnit = React.createClass({

  handleClick: function (e) {
    if (this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },
  render: function () {
    var ControllerUnitClassName = "controller-unit";
    if (this.props.arrange.isCenter) {
      ControllerUnitClassName += " is-center";
      if (this.props.arrange.isInverse) {
        ControllerUnitClassName += " is-inverse";
      }
    }
    return (
      <span className={ControllerUnitClassName} onClick={this.handleClick} >
      </span >
    );
  }
});

var GalleryByReactApp = React.createClass({

  Constant: {
    centerPos: {
      left: 0,
      right: 0
    },
    hPosRange: {
      leftSecX: [0, 0],
      rightSecX: [0, 0],
      y: [0, 0]
    },
    vPosRange: {
      x: [0, 0],
      topY: [0, 0]
    }
  },

  inverse: function (index) {
    return function () {
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },

  //重新布局所有图片

  rearrange: function (centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeX = vPosRange.x,
      vPosRangeTopY = vPosRange.topY,

      imgsArrangeTopArr = [],
      topImgNum = Math.floor(Math.random() * 2),
      topImgSpliceIndex = 0,

      //居中的图片
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    imgsArrangeCenterArr[0] = {
      pos: centerPos,
      rotate: 0,
      isCenter: true
    };

    //取出要布局上册的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    //布局位于上册的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1]),
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1])
        },
        rotate: get30DegRandom(),
        isCenter: false

      };
    });

    //布局左右两侧的图片
    for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      var hPosRangeLORX = null;

      // 前半部分布局左边， 右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom(),
        isCenter: false
      };

    }
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  },
  center: function (index) {
    return function () {
      this.rearrange(index);
    }.bind(this);
  },
  getInitialState: function () {
    return {
      imgsArrangeArr: []
    };
  },

  //组件加载以后为每张图片设置位置
  componentDidMount: function () {
    var stageDOM = React.findDOMNode(this.refs.stage),
      stageW = stageDOM.scrollWidth,
      stageH = stageDOM.scrollHeight,
      halfStageW = Math.ceil(stageW / 2),
      halfStageH = Math.ceil(stageH / 2);
    //拿到一个imgfigure的大小
    var imgFigureDOM = React.findDOMNode(this.refs.ImgFigure0),
      imgW = imgFigureDOM.scrollWidth,
      imgH = imgFigureDOM.scrollHeight,
      halfImgW = Math.ceil(imgW / 2),
      halfImgH = Math.ceil(imgH / 2);
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;


    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

    this.rearrange(0);
  },
  render: function () {
    var ControllerUnits = [],
      ImgFigures = [];


    imageDatas.forEach(function (value, index) {
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          center: false
        };
      }
      ImgFigures.push(<ImgFigure data={value} key={index} ref={'ImgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index) } center={this.center(index) }/>);
      ControllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index) } center={this.center(index) }/>);
    }.bind(this));
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {ImgFigures}
        </section>
        <nav className="controller-nav">
          {ControllerUnits}
        </nav>
      </section>
    );
  }
});
React.render(<GalleryByReactApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryByReactApp;
