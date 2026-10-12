package kr.co.kfs.asseterp.biz.emp.mapper;

import kr.co.kfs.asseterp.biz.emp.dto.NoteAdminRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersRes;
import kr.co.kfs.asseterp.biz.emp.dto.OthersSaveReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/** AS-IS server/emp/Emp02_Others (updateOne) + selectByText의 empOthersModel 컬럼 */
@Mapper
public interface EmpOthersMapper {
    /** 로그인 회사 사람의 기타정보. 사람이 없으면 null, 기타정보 행이 없으면 personId만 */
    OthersRes selectOthers(@Param("companyId") Long companyId, @Param("personId") Long personId);

    /** AS-IS emp02_others.upsert */
    int upsertOthers(OthersSaveReq req);

    /** C03 비고 팝업: AS-IS emp02_others.selectById (사람 기준으로 고침). 없으면 null */
    NoteAdminRes selectNoteAdmin(@Param("personId") Long personId);

    /** AS-IS modelUpdate → UpdateDataModel(emp02_others) UPDATE 중 emp02_note_admin. 그 사람의 그 행이 없으면 0 */
    int updateNoteAdmin(@Param("personId") Long personId, @Param("othersId") Long othersId, @Param("noteAdmin") String noteAdmin);

    /** AS-IS modelUpdate: othersId == null → getSeq + INSERT */
    int insertNoteAdmin(@Param("personId") Long personId, @Param("noteAdmin") String noteAdmin);
}
