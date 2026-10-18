package kr.co.kfs.asseterp.biz.dcr.mapper;

import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeRes;
import kr.co.kfs.asseterp.biz.dcr.dto.DcrDocTypeUpdateReq;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/** AS-IS server/dcr/mapper/dcr05_doc_type.xml + UpdateDataModel(dcr05_doc_type) — 문서양식 */
@Mapper
public interface DcrDocTypeMapper {
    /** AS-IS selectByName: 양식 제목+비고 LIKE(대소문자 무시)·구분 LIKE, 회사의 구분 코드명 붙임. 둘 다 LIKE 패턴 */
    List<DcrDocTypeRes> selectByName(@Param("companyId") Long companyId, @Param("titleName") String titleName,
                                     @Param("formClassCode") String formClassCode);

    DcrDocTypeRes selectById(@Param("docTypeId") Long docTypeId, @Param("companyId") Long companyId);

    /** Dcr05_Edit_Update.updateEdit (UpdateDataModel) */
    int updateEdit(@Param("companyId") Long companyId, @Param("docTypeId") Long docTypeId, @Param("req") DcrDocTypeUpdateReq req);

    /** dbConfig.getSeq (f_create_seq) */
    Long selectNextId();

    /** Dcr05_Edit_DocType.update (UpdateDataModel 신규 INSERT) */
    int insert(@Param("docTypeId") Long docTypeId, @Param("companyId") Long companyId, @Param("req") DcrDocTypeUpdateReq req);

    /** AS-IS dcr06_relate_doc_Type.selectByDocTypeId 행 수 — 문서구분에 연결된 양식인지 */
    int countRelate(@Param("docTypeId") Long docTypeId);

    /** UpdateDataModel.deleteModel (ID로 DELETE) — 회사 조건은 다른 회사 양식을 못 지우도록 더했다 */
    int deleteByIds(@Param("companyId") Long companyId, @Param("ids") List<Long> ids);

    /** dcr05_doc_type.checkDocFormClassCode: 이 구분 코드를 쓰는 양식 수 (Sys09_Lookup_Code 코드 삭제·변경 검사) */
    int checkDocFormClassCode(@Param("companyId") Long companyId, @Param("docFormClassCode") String docFormClassCode);
}
