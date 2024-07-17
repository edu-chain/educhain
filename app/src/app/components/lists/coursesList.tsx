
import useCourses from "~/app/components/hooks/useCourses";
import Loading from "~/app/components/loading";
import { grid } from "styled-system/patterns";
import CourseCardSubscription from "../cards/courseCardSubscription";


export default function CoursesList() {

  const { coursesList, loading, errorMessage } = useCourses({type: 'all'});

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <>
    {
      loading ?
        <Loading />
      :
      <>
      <div className={grid({
          gap: 6,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 400px))",
          gridAutoRows: "minmax(200px, 1fr)",
      })}>
        {coursesList.map((course) => 
          <CourseCardSubscription key={course.publicKey.toBase58()} course={course}/>
        )}
      </div>
      </>
    }
    </>
  );
}