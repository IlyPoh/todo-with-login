// modules
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';

// components
import { Button } from '../../components/UI/Button/Button';

// utils
import { loginSchema } from '../../utils/loginSchema';

// styles
import styles from './Login.module.scss';

export const Login: React.FC = () => {
  const navigate = useNavigate();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues: {
      username: '',
      phoneNumber: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, actions) => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );
        const data = await response.json();

        const userExists = data.find(
          (user: { username: string; phone: string }) => {
            const pattern = /[^0-9]/g;

            return (
              user.username === values.username &&
              user.phone.replace(pattern, '') ===
                values.phoneNumber.replace(pattern, '')
            );
          }
        );

        if (userExists) {
          navigate(`/todo/${userExists.id}`);
        } else {
          console.log('user does not exist');
        }

        actions.resetForm();
      } catch (error) {
        console.log(error);
      }
    },
  });

  const inputClasses = (
    error: string | undefined,
    touched: boolean | undefined
  ) => {
    if (touched && error) {
      return styles['error'];
    } else if (touched) {
      return styles['success'];
    }
  };

  return (
    <>
      <div className={styles['block']}>
        <form
          onSubmit={handleSubmit}
          className={styles['login-form']}
          action="submit"
        >
          <div className={styles['title']}>
            <span>description</span>
          </div>
          <div className={styles['body']}>
            <div className={styles['information']}>description</div>
            <div className={styles['input-block']}>
              <input
                className={inputClasses(errors.username, touched.username)}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                id="username"
                placeholder="Username"
              />
              {errors.username && touched.username && (
                <div className={styles['error-message']}>{errors.username}</div>
              )}
            </div>
            <div className={styles['input-block']}>
              <input
                className={inputClasses(
                  errors.phoneNumber,
                  touched.phoneNumber
                )}
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                id="phoneNumber"
                placeholder="Phone Number"
              />
              {errors.phoneNumber && touched.phoneNumber && (
                <div className={styles['error-message']}>
                  {errors.phoneNumber}
                </div>
              )}
            </div>
            <Button
              disabled={isSubmitting}
              classes={
                isSubmitting ? 'btn btn-green submitting' : 'btn btn-green'
              }
              text={isSubmitting ? 'Wait...' : 'Register'}
            />
          </div>
        </form>
      </div>
    </>
  );
};
