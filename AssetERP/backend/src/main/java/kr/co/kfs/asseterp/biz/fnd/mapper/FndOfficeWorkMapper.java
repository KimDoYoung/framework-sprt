package kr.co.kfs.asseterp.biz.fnd.mapper;

import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanyRes;
import kr.co.kfs.asseterp.biz.fnd.dto.OfficeWorkCompanySaveReq;
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

    /** AS-IS selectByText (P05 조회창) */
    List<OfficeWorkRes> selectByText(@Param("companyId") Long companyId, @Param("searchText") String searchText);

    /** AS-IS fnd06_office_work.selectByCompanyId (R11 Fnd06_Tab_OfficeWork — 회사별 사무수탁사 목록) */
    List<OfficeWorkCompanyRes> selectByCompanyId(@Param("companyId") Long companyId, @Param("useYn") String useYn, @Param("searchText") String searchText);

    /** AS-IS fnd06_office_work.selectById (R11 회사별 전체 열) */
    OfficeWorkCompanyRes selectCompanyById(@Param("officeWorkId") Long officeWorkId);

    /** AS-IS fnd06_office_work.selectByCd (R11 preUpdate 중복 코드 검사) */
    int countByCd(@Param("companyId") Long companyId, @Param("officeWorkCode") String officeWorkCode);

    /** AS-IS UpdateDataModel(fnd06_office_work) INSERT (R11) */
    int insertCompanyOfficeWork(@Param("officeWorkId") Long officeWorkId, @Param("req") OfficeWorkCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd06_office_work) UPDATE (R11) */
    int updateCompanyOfficeWork(@Param("req") OfficeWorkCompanySaveReq req, @Param("companyId") Long companyId);

    /** AS-IS UpdateDataModel(fnd06_office_work) DELETE (R11) */
    int deleteCompanyOfficeWorks(@Param("companyId") Long companyId, @Param("officeWorkIds") List<Long> officeWorkIds);
}
