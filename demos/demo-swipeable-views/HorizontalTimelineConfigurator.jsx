import React from 'react';
import PropTypes from 'prop-types';


const Container = (props) => (
  <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
    <div style={{ flex: 2, fontSize: 20 }}>{ props.label }</div>
    { props.children }
  </div>
)

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
)

const NumberIn = ({ label, config, min, max, ...rest }) => (
  <div style={{ flex: 1 }}>
    <label >{label}</label>
    &nbsp;
    <input
      min={min}
      max={max}
      onChange={(e) => {
        rest.setConfig(config, Number(e.target.value));
      }}
      type='number'
      value={rest[config]}
    />
  </div>
)

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
)

const HorizontalTimelineConfigurator = (props) => {
  return (
    <div className={'container'} style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
      <h2 className='text-center' style={{ flex: 1 }} >Configure the Timeline</h2>

      <Container label='Padding between events'>
        <NumberIn label='Minimum' config='minEventPadding' max={props.maxEventPadding} min={20} {...props} />
        <NumberIn label='Maximum' config='maxEventPadding' min={props.minEventPadding} {...props} />
      </Container>

      <Container label='Endings'>
        <CheckIn label='Open Begining' config='isOpenBeginning' {...props} />
        <CheckIn label='Open Ending' config='isOpenEnding' {...props} />
      </Container>

      <Container label='Padding/Width'>
        <NumberIn label='Line Padding' config='linePadding' {...props} />
        <NumberIn label='Lable Width' config='labelWidth' {...props} />
      </Container>

      <Container label='Filling Motion'>
        <NumberIn label='Stiffness' config='fillingMotionStiffness' {...props} />
        <NumberIn label='Damping' config='fillingMotionDamping' {...props} />
      </Container>

      <Container label='Sliding Motion'>
        <NumberIn label='Stiffness' config='slidingMotionStiffness' {...props} />
        <NumberIn label='Damping' config='slidingMotionDamping' {...props} />
      </Container>

      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: 3, fontSize: 20 }}>Styling</div>
        <ColorIn label='Background' config='stylesBackground' {...props} />
        <ColorIn label='Foreground' config='stylesForeground' {...props} />
        <ColorIn label='Outline' config='stylesOutline' {...props} />
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
