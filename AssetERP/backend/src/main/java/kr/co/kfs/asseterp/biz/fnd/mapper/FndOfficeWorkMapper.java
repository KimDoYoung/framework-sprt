package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface FndOfficeWorkMapper {

    /** AS-IS fnd06_office_work.selectByCompanyId0 (공통회사 0 전용) */
    List<OfficeWorkRes> selectByCompanyId0(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS fnd06_office_work.selectById */
    OfficeWorkRes selectById(@Param("officeWorkId") Long officeWorkId);

    /** AS-IS UpdateDataModel UPDATE — 화면이 고치는 열만(이름·사용여부·기타 사무수탁사코드 02~10은 그대로 둔다) */
    int updateOfficeWork(@Param("req") OfficeWorkSaveReq req);

    /** AS-IS dbConfig.getSeq */
    long selectNextId();

    /** AS-IS UpdateDataModel INSERT */
    int insertOfficeWork(@Param("officeWorkId") Long officeWorkId, @Param("req") OfficeWorkSaveReq req, @Param("companyId") Long companyId);
}
