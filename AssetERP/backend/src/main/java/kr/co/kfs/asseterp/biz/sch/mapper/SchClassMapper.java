package kr.co.kfs.asseterp.biz.sch.mapper;

import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassComboRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassRes;
import kr.co.kfs.asseterp.biz.sch.dto.Sch08ClassSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SchClassMapper {

    /** AS-IS sch08_class.selectByPersonId */
    List<Sch08ClassRes> selectByPersonId(@Param("personId") Long personId);

    Sch08ClassRes selectById(@Param("classId") Long classId, @Param("personId") Long personId);

    /** AS-IS sys09_code.selectScheduleClass */
    List<Sch08ClassComboRes> selectCombo(@Param("personId") Long personId);

    /** AS-IS sys09_code.selectScheduleClass2 (내 분류 + 공모주) */
    List<Sch08ClassComboRes> selectCombo2(@Param("personId") Long personId);

    /** AS-IS sch01_info.checkClassId */
    int countInfoByClassId(@Param("classId") Long classId);

    long selectNextId();

    int insertClass(@Param("classId") Long classId, @Param("personId") Long personId, @Param("req") Sch08ClassSaveReq req);

    int updateClass(@Param("personId") Long personId, @Param("req") Sch08ClassSaveReq req);

    int deleteClasses(@Param("personId") Long personId, @Param("classIds") List<Long> classIds);
}
