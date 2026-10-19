package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrOftenUseRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr08_often_use.xml */
@Mapper
public interface DcrOftenUseMapper {
    /** AS-IS selectByPersonId — 사용횟수 내림차순 */
    List<DcrOftenUseRes> selectByPersonId(@Param("personId") Long personId);
}
