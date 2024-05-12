import React from 'react';

import {
  Fieldset,
  Input,
  Label,
  Legend,
  Field,
  Button,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Switch,
  Select,
} from '@headlessui/react';

import { useFormik } from 'formik';
import * as yup from 'yup';

import { FaTrashCan } from 'react-icons/fa6';

import { FaPlus } from 'react-icons/fa';
import Color from '../../components/Forms/Color';

const TEXT_TEMPLATE = {
  content: '',
  x: 0,
  y: 0,
  color: '#000000',
  size: 40,
};

const IMAGE_TEMPLATE = {
  url: '',
  x: 0,
  y: 0,
  width: 200,
  height: 200,
};

const BACKGROUND_TYPES = ['color', 'image'];

const FRAME_TEMPLATE = {
  includeImage: false,
  texts: [TEXT_TEMPLATE],
  images: [IMAGE_TEMPLATE],
  backgroundType: BACKGROUND_TYPES[0],
  background: '#000000',
  audioUrl: '',
};

const frameSchema = yup.object().shape({
  includeImage: yup.bool().optional(),
  texts: yup.array().of(
    yup.object().shape({
      content: yup.string().required('Content is required'),
      x: yup
        .number()
        .positive('Value should be positive')
        .required('X-axis position is required'),
      y: yup
        .number()
        .positive('Value should be positive')
        .required('Y-axis position is required'),
      size: yup
        .number()
        .positive('Value should be positive')
        .required('Size is required'),
      color: yup
        .string()
        .test('hex-code-validator', 'Invalid hex code', (value) =>
          /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(value)
        ),
    })
  ),
  images: yup.array().of(
    yup.object().shape({
      url: yup.string().when('includeImage', {
        is: true,
        then: yup.string().required('Url is required'),
      }),
      // .test('img-url-validator', 'Invalid url', (value) =>
      //   /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?\/[a-zA-Z0-9]{2,}|((https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z]{2,}(\.[a-zA-Z]{2,})(\.[a-zA-Z]{2,})?)|(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})?/g.test(
      //     value
      //   )
      // )
      x: yup
        .number()
        .positive('Value should be positive')
        .when('includeImage', {
          is: true,
          then: yup.string().required('Url is required'),
        })
        .required('X-axis position is required'),
      y: yup
        .number()
        .positive('Value should be positive')
        .when('includeImage', {
          is: true,
          then: yup.string().required('Y-axis position is required'),
        }),
      width: yup
        .number()
        .positive('Value should be positive')
        .when('includeImage', {
          is: true,
          then: yup.string().required('Width is required'),
        }),
      height: yup
        .number()
        .positive('Value should be positive')
        .when('includeImage', {
          is: true,
          then: yup.string().required('Height is required'),
        }),
    })
  ),
  backgroundType: yup.string(),
  // .required('Background type is required')
  // .oneOf(BACKGROUND_TYPES, 'Invalid value'),
  background: yup.string(),
  // .required('Value is required')
  // .when('backgroundType', {
  //   is: BACKGROUND_TYPES[0],
  //   then: yup
  //     .string()
  //     .test('hex-code-validator', 'Invalid hex code', (value) =>
  //       /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(value)
  //     ),
  // })
  // .when('backgroundType', {
  //   is: BACKGROUND_TYPES[1],
  //   then: yup
  //     .string()
  //     .test('url-validation', 'Invalid hex code', (value) =>
  //       /^#[0-9A-F]{3}$|^#[0-9A-F]{6}$/i.test(value)
  //     ),
  // }),
  audioUrl: yup.string().optional(),
});

const Create = () => {
  const formik = useFormik({
    initialValues: {
      frames: [FRAME_TEMPLATE],
    },
    validationSchema: frameSchema,
    onSubmit: (data) => {
      console.log({ data });
      window.aa = data;
    },
  });

  const addFrame = () => {
    formik.setFieldValue(`frames`, [
      ...formik.values['frames'],
      FRAME_TEMPLATE,
    ]);
  };

  const addText = (index) => {
    formik.setFieldValue(`frames.${index}.texts`, [
      ...formik.values['frames'][index].texts,
      TEXT_TEMPLATE,
    ]);
  };

  const addImage = (index) => {
    formik.setFieldValue(`frames.${index}.images`, [
      ...formik.values['frames'][index].images,
      IMAGE_TEMPLATE,
    ]);
  };

  const deleteFor = (key, index, forIndex) => {
    if (formik?.values?.['frames']?.[index]?.[key]?.length > 1) {
      const els = [...formik.values['frames'][index][key]];

      els.splice(forIndex, 1);

      formik.setFieldValue(`frames.${index}.${key}`, [...els]);
    }
  };

  const deleteFrame = (index) => {
    if (formik?.values?.['frames']?.length > 1) {
      const els = [...formik.values['frames']];

      els.splice(index, 1);

      formik.setFieldValue(`frames`, [...els]);
    }
  };

  const handleChange = (changeFor, key, value, index, forIndex) => {
    formik.setFieldValue(
      `frames.${index}.${changeFor}.${forIndex}.${key}`,
      value
    );
  };

  const handleDirectChange = (key, value, index) => {
    formik.setFieldValue(`frames.${index}.${key}`, value);
  };

  console.log({ errors: formik.errors });
  console.log({ values: formik.values });

  return (
    <div className=' container mx-auto h-full py-10 px-4'>
      <form
        className='flex flex-col justify-start items-start gap-4'
        onSubmit={formik.handleSubmit}
      >
        {formik.values['frames'].map((frame, index) => (
          <div
            key={`frame-${index}`}
            className='w-full bg-white p-4 px-6 rounded-md shadow-lg'
          >
            <div className='flex justify-between items-center gap-2'>
              <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
                #Frame {index + 1}
              </h2>

              <div className='flex justify-center items-center gap-2'>
                {index === 0 && (
                  <Button
                    onClick={() => addFrame()}
                    title='Add frame'
                    className={
                      'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                    }
                  >
                    <FaPlus />
                  </Button>
                )}
                {formik.values['frames'].length > 1 && (
                  <Button
                    title={`Delete frame ${index + 1}`}
                    className={
                      'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                    }
                    onClick={() => deleteFrame(index)}
                  >
                    <FaTrashCan />
                  </Button>
                )}
              </div>
            </div>

            <TabGroup>
              <TabList className='flex gap-4'>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Text
                </Tab>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Images
                </Tab>
                <Tab className='w-full rounded-lg bg-[#e5e5e5] py-3 text-sm/6 font-semibold text-[#aeadae] focus:outline-none data-[selected]:bg-[#6A64F1] hover:bg-[#6A64F1] hover:text-white data-[selected]:text-white data-[selected]:data-[hover]:bg-[#6A64F1] data-[focus]:outline-1 data-[focus]:outline-white'>
                  Others
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  {frame.texts.map((text, textIndex) => (
                    <Fieldset
                      className='space-y-4 mt-2 border-t-2 border-b-2 border-gray-300 py-4'
                      key={`frame-${index}-text-${textIndex}`}
                    >
                      <Legend className='text-lg font-bold flex justify-between items-center'>
                        <span className='block'>{`Text ${textIndex + 1}`}</span>
                        <div className='flex justify-center items-center gap-2'>
                          {textIndex === 0 && (
                            <Button
                              onClick={() => addText(index)}
                              title='Add text'
                              className={
                                'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                              }
                            >
                              <FaPlus />
                            </Button>
                          )}
                          {frame.texts.length > 1 && (
                            <Button
                              title={`Delete Text ${textIndex + 1}`}
                              className={
                                'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                              }
                              onClick={() =>
                                deleteFor('texts', index, textIndex)
                              }
                            >
                              <FaTrashCan />
                            </Button>
                          )}
                        </div>
                      </Legend>
                      <Field>
                        <Label
                          className='block'
                          htmlFor={`frame-${index}-text-content-${textIndex}`}
                        >
                          Content
                        </Label>
                        <Input
                          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          id={`frame-${index}-text-content-${textIndex}`}
                          value={text.content}
                          onChange={(e) =>
                            handleChange(
                              'texts',
                              'content',
                              e.target.value,
                              index,
                              textIndex
                            )
                          }
                        />
                      </Field>
                      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frame-${index}-text-x-${textIndex}`}
                          >
                            X-axis position
                          </Label>
                          <Input
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                            id={`frame-${index}-text-x-${textIndex}`}
                            defaultValue={text.x}
                            onChange={(e) =>
                              handleChange(
                                'texts',
                                'x',
                                e.target.value,
                                index,
                                textIndex
                              )
                            }
                          />
                        </Field>

                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frame-${index}-text-y-${textIndex}`}
                          >
                            Y-axis position
                          </Label>
                          <Input
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                            id={`frame-${index}-text-y-${textIndex}`}
                            defaultValue={text.y}
                            onChange={(e) =>
                              handleChange(
                                'texts',
                                'y',
                                e.target.value,
                                index,
                                textIndex
                              )
                            }
                          />
                        </Field>

                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frame-${index}-text-size-${textIndex}`}
                          >
                            Font size
                          </Label>
                          <Input
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                            id={`frame-${index}-text-size-${textIndex}`}
                            defaultValue={text.size}
                            onChange={(e) =>
                              handleChange(
                                'texts',
                                'size',
                                e.target.value,
                                index,
                                textIndex
                              )
                            }
                          />
                        </Field>

                        <Color
                          id={`frame-${index}-text-color-${textIndex}`}
                          label={'Font color'}
                          value={text.color}
                          onChange={(e) =>
                            handleChange(
                              'texts',
                              'color',
                              e.target.value,
                              index,
                              textIndex
                            )
                          }
                        />
                      </div>
                    </Fieldset>
                  ))}
                </TabPanel>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  <Field className='flex flex-row justify-start items-center gap-2'>
                    <Switch
                      id={`frame-includeImage-${index}`}
                      checked={frame.includeImage}
                      onChange={(checked) =>
                        handleDirectChange('includeImage', checked, index)
                      }
                      className='group relative flex h-7 w-14 cursor-pointer rounded-full bg-[#e5e5e5] p-1 transition-colors duration-200 ease-in-out focus:outline-none data-[focus]:outline-1 data-[focus]:outline-white data-[checked]:bg-[#6A64F1]'
                    >
                      <span
                        aria-hidden='true'
                        className='pointer-events-none inline-block size-5 translate-x-0 rounded-full bg-white ring-0 shadow-lg transition duration-200 ease-in-out group-data-[checked]:translate-x-7'
                      />
                    </Switch>
                    <Label htmlFor={`frame-includeImage-${index}`}>
                      Include image
                    </Label>
                  </Field>

                  {frame.includeImage &&
                    frame.images.map((image, imageIndex) => (
                      <Fieldset
                        className='space-y-4 mt-2 border-t-2 border-b-2 border-gray-300 py-4'
                        key={`frame-${index}-image-${imageIndex}`}
                      >
                        <Legend className='text-lg font-bold flex justify-between items-center'>
                          <span className='block'>{`Image ${
                            imageIndex + 1
                          }`}</span>
                          <div className='flex justify-center items-center gap-2'>
                            {imageIndex === 0 && (
                              <Button
                                onClick={() => addImage(index)}
                                title='Add image'
                                className={
                                  'hover:bg-[#6A64F1]/90 rounded-md bg-[#6A64F1] p-2 text-center text-base font-semibold text-white outline-none'
                                }
                              >
                                <FaPlus />
                              </Button>
                            )}
                            {frame.images.length > 1 && (
                              <Button
                                title={`Delete Image ${imageIndex + 1}`}
                                className={
                                  'hover:bg-rose-600/90 rounded-md bg-rose-600 p-2 text-center text-base font-semibold text-white outline-none'
                                }
                                onClick={() =>
                                  deleteFor('images', index, imageIndex)
                                }
                              >
                                <FaTrashCan />
                              </Button>
                            )}
                          </div>
                        </Legend>
                        <Field>
                          <Label
                            className='block'
                            htmlFor={`frame-${index}-image-url-${imageIndex}`}
                          >
                            Url
                          </Label>
                          <Input
                            className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                            id={`frame-${index}-image-url-${imageIndex}`}
                            value={image.url}
                            onChange={(e) =>
                              handleChange(
                                'images',
                                'url',
                                e.target.value,
                                index,
                                imageIndex
                              )
                            }
                          />
                        </Field>
                        <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frame-${index}-image-x-${imageIndex}`}
                            >
                              X-axis position
                            </Label>
                            <Input
                              className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                              id={`frame-${index}-image-x-${imageIndex}`}
                              defaultValue={image.x}
                              onChange={(e) =>
                                handleChange(
                                  'images',
                                  'x',
                                  e.target.value,
                                  index,
                                  imageIndex
                                )
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frame-${index}-image-y-${imageIndex}`}
                            >
                              Y-axis position
                            </Label>
                            <Input
                              className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                              id={`frame-${index}-image-y-${imageIndex}`}
                              defaultValue={image.y}
                              onChange={(e) =>
                                handleChange(
                                  'images',
                                  'y',
                                  e.target.value,
                                  index,
                                  imageIndex
                                )
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frame-${index}-image-width-${imageIndex}`}
                            >
                              Width
                            </Label>
                            <Input
                              className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                              id={`frame-${index}-image-width-${imageIndex}`}
                              defaultValue={image.width}
                              onChange={(e) =>
                                handleChange(
                                  'images',
                                  'width',
                                  e.target.value,
                                  index,
                                  imageIndex
                                )
                              }
                            />
                          </Field>

                          <Field>
                            <Label
                              className='block'
                              htmlFor={`frame-${index}-image-height-${imageIndex}`}
                            >
                              Height
                            </Label>
                            <Input
                              className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                              id={`frame-${index}-image-height-${imageIndex}`}
                              defaultValue={image.height}
                              onChange={(e) =>
                                handleChange(
                                  'images',
                                  'height',
                                  e.target.value,
                                  index,
                                  imageIndex
                                )
                              }
                            />
                          </Field>
                        </div>
                      </Fieldset>
                    ))}
                </TabPanel>
                <TabPanel className='rounded-xl bg-white/5 p-3'>
                  <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    <Field>
                      <Label
                        className='block mb-1'
                        htmlFor={`frame-${index}-backgroundType`}
                      >
                        Background type
                      </Label>
                      <Select
                        id={`frame-${index}-backgroundType`}
                        value={frame.backgroundType}
                        onChange={(e) => {
                          handleDirectChange(
                            'backgroundType',
                            e.target.value,
                            index
                          );

                          if (e.target.value == 'color') {
                            handleDirectChange('background', '#000000', index);
                          } else {
                            handleDirectChange('background', '', index);
                          }
                        }}
                        className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 pl-2 text-base font-medium text-[#6B7280] outline-none border-r-8 border-transparent outline outline-[#e0e0e0]/50'
                      >
                        {BACKGROUND_TYPES.map((type, typeIndex) => (
                          <option
                            value={type}
                            key={`frame-${index}-background-type-${typeIndex}`}
                            className='first-letter:uppercase'
                          >
                            {type}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    {frame.backgroundType === 'color' ? (
                      <Color
                        id={`frame-${index}-background`}
                        label={'Background color'}
                        value={frame.background}
                        onChange={(e) =>
                          handleDirectChange(
                            'background',
                            e.target.value,
                            index
                          )
                        }
                      />
                    ) : (
                      <Field>
                        <Label
                          className='block'
                          htmlFor={`frame-${index}-background`}
                        >
                          Background image url
                        </Label>
                        <Input
                          className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                          id={`frame-${index}-background`}
                          value={frame.background}
                          onChange={(e) =>
                            handleDirectChange(
                              'background',
                              e.target.value,
                              index
                            )
                          }
                        />
                      </Field>
                    )}
                    <Field>
                      <Label
                        className='block'
                        htmlFor={`frame-${index}-audioUrl`}
                      >
                        Audio url [optional]
                      </Label>
                      <Input
                        className='w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md'
                        id={`frame-${index}-audioUrl`}
                        value={frame.audioUrl}
                        onChange={(e) =>
                          handleDirectChange('audioUrl', e.target.value, index)
                        }
                      />
                    </Field>
                  </div>
                </TabPanel>
              </TabPanels>
            </TabGroup>
          </div>
        ))}
        <Button
          type='submit'
          className='flex gap-3 items-center ml-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 border-b-violet-700 border-b-4 text-white font-bold rounded-lg transition-transform transform-gpu hover:-translate-y-1 hover:shadow-lg'
        >
          <span>Submit</span>
        </Button>
      </form>
    </div>
  );
};

export default Create;
