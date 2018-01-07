import React from 'react';
import PropTypes from 'prop-types';


const Container = (props) => (
  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
    <div style={{ flex: 2, fontSize: 20 }}>{ props.label }</div>
    { props.children }
  </div>
);

Container.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.array.isRequired
};

const ColorIn = ({ label, config, ...rest }) => (
  <div style={{ flex: 1 }}>
    <label >{label}</label>
    &nbsp;
    <input
      onChange={(e) => {
        rest.setConfig(config, e.target.value);
      }}
      type='color'
      value={rest[config]}
    />
  </div>
);

ColorIn.propTypes = {
  label: PropTypes.string.isRequired,
  config: PropTypes.string.isRequired
};

const NumberIn = ({ label, config, min, max, ...rest }) => (
  <div style={{ flex: 1 }}>
    <label >{label}</label>
    &nbsp;
    <input
      max={max}
      min={min}
      onChange={(e) => {
        rest.setConfig(config, Number(e.target.value));
      }}
      type='number'
      value={rest[config]}
    />
  </div>
);

NumberIn.propTypes = {
  label: PropTypes.string.isRequired,
  config: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number
};

const CheckIn = ({ label, config, ...rest }) => (
  <div style={{ flex: 1 }}>
    <label>{label}</label>
    <input
      checked={rest[config]}
      onChange={(e) => {
        rest.setConfig(config, e.target.checked);
      }}
      type='checkbox'
    />
  </div>
);

CheckIn.propTypes = {
  label: PropTypes.string.isRequired,
  config: PropTypes.string.isRequired
};


const HorizontalTimelineConfigurator = (props) => {
  return (
    <div className={'container'} style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
      <h2 className='text-center' style={{ flex: 1 }} >Configure the Timeline</h2>

      <Container label='Padding between events'>
        <NumberIn config='minEventPadding' label='Minimum' max={props.maxEventPadding} min={20} {...props} />
        <NumberIn config='maxEventPadding' label='Maximum' min={props.minEventPadding} {...props} />
      </Container>

      <Container label='Endings'>
        <CheckIn config='isOpenBeginning' label='Open Begining' {...props} />
        <CheckIn config='isOpenEnding' label='Open Ending' {...props} />
      </Container>

      <Container label='Padding/Width'>
        <NumberIn config='linePadding' label='Line Padding' {...props} />
        <NumberIn config='labelWidth' label='Lable Width' {...props} />
      </Container>

      <Container label='Filling Motion'>
        <NumberIn config='fillingMotionStiffness' label='Stiffness' {...props} />
        <NumberIn config='fillingMotionDamping' label='Damping' {...props} />
      </Container>

      <Container label='Sliding Motion'>
        <NumberIn config='slidingMotionStiffness' label='Stiffness' {...props} />
        <NumberIn config='slidingMotionDamping' label='Damping' {...props} />
      </Container>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 3, fontSize: 20 }}>Styling</div>
        <ColorIn config='stylesBackground' label='Background' {...props} />
        <ColorIn config='stylesForeground' label='Foreground' {...props} />
        <ColorIn config='stylesOutline' label='Outline' {...props} />
      </div>

    </div>
  );
};

HorizontalTimelineConfigurator.propTypes = {
  fillingMotionStiffness: PropTypes.number.isRequired,
  fillingMotionDamping: PropTypes.number.isRequired,
  isOpenEnding: PropTypes.bool.isRequired,
  isOpenBeginning: PropTypes.bool.isRequired,
  linePadding: PropTypes.number.isRequired,
  labelWidth: PropTypes.number.isRequired,
  maxEventPadding: PropTypes.number.isRequired,
  minEventPadding: PropTypes.number.isRequired,
  setConfig: PropTypes.func.isRequired,
  slidingMotionStiffness: PropTypes.number.isRequired,
  slidingMotionDamping: PropTypes.number.isRequired,
  stylesBackground: PropTypes.string.isRequired,
  stylesForeground: PropTypes.string.isRequired,
  stylesOutline: PropTypes.string.isRequired
};

export default HorizontalTimelineConfigurator;
